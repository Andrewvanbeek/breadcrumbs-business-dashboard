<template>
  <v-data-table :headers="headers" :items="desserts" sort-by="calories" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Users at {{table.name}}</v-toolbar-title>
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
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
    table: {},
    headers: [
      {
        text: "User Identifier",
        align: "start",
        sortable: false,
        value: "id"
      },
      { text: "Last Visit", value: "timestamp" },
      { text: "Covid Status", value: "status" },
      { text: "Actions", value: "actions", sortable: false }
    ],
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

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      var component = this;
      var path = this.$router.currentRoute.path;
      console.log(path.split("/"));
      var doc = path.split("/")[2];
      console.log(doc);
      this.$firestore
        .collection("tables")
        .doc(doc)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            var customers = doc.collection
            console.log(customers)
            component.table = doc.data();
            console.log("Document data:", doc.data());
          } else {
            console.log("No such document!");
          }
        });
      var users = [];
      this.$firestore
        .collection("tables")
        .doc(doc)
        .collection("users")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(async function(doc) {
              console.log(doc)
            users.push({ id: doc.id, timestamp: doc.data().timestamp, status: doc.data().user_metadata.has_covid });
          });
        });

        var customers = await this.$firestore.collection("tables").doc(doc).collection("customers").get()

        customers =  customers.docs.map(function(doc) {
          var customerdata = doc.data()
          console.log(customerdata)
          return {"id": customerdata.user, "timestamp": customerdata.visit_date.toDate(), status: customerdata.has_covid ? "Covid 19 Postive! Notify Staff" : "No Covid"}
        });
        console.log(customers)
        component.desserts = customers
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>

