<template>
  <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Tables at {{business}}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Table</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Table name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.occupancy" label="Occupancy"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon><v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon></v-btn>
      <v-btn :to="{ name: 'Table', params: { id: item.id }}" icon><v-icon small>mdi-eye</v-icon></v-btn>
      <v-btn icon><v-icon small @click="deleteItem(item)">mdi-delete</v-icon></v-btn>
      
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Table Name",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Occupancy Number", value: "occupancy" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    business: "",
    businessAddress: "",
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      occupancy: ""
    },
    defaultItem: {
      name: "",
      occupancy: 2
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
   async initialize() {
      var component = this;
      var tables = [];
      var uid = component.$firebase.auth().currentUser.uid
      var user = await component.$firestore.collection("users").doc(uid).get()
      user = await user.data() //andrewvan beek business is cool business, the address business
      component.business = user.business
      component.businessAddress = user.address
      component.$firestore.collection("tables").where("business", "==", user.business).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var tableData = doc.data();
            var table = {
              id: doc.id,
              name: tableData.name,
              occupancy: tableData.occupancy
            };
            tables.push(table);
          });
        });
        console.log(tables)
      component.desserts = tables;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      var component = this;
      var tableRef = component.$firestore
        .collection("tables")
        .doc(item.id);
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && tableRef
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
          component.desserts.splice(index, 1)
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      var component = this;
      if (this.editedIndex > -1) {
        this.editedItem.business = component.business
        this.editedItem.businessAddress = component.address
        this.editedItem.owner = await component.$firebase.auth().currentUser.email
        var tableRef = component.$firestore
          .collection("tables")
          .doc(this.editedItem.id);
        return tableRef
          .update(this.editedItem)
          .then(function() {
            Object.assign(
              component.desserts[component.editedIndex],
              component.editedItem
            );
            component.close();
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      } else {
        console.log(component.$firebase.auth().currentUser)
        this.editedItem.business = component.business
        this.editedItem.businessAddress = component.businessAddress
        this.editedItem.owner = await component.$firebase.auth().currentUser.email
        var addedTable = await component.$firestore.collection("tables").add(this.editedItem);
        this.editedItem.id = addedTable.id
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  },
  async mounted() {
    this.initialize()
  }
};
</script>

