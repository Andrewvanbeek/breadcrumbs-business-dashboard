<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Register Form</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <!-- <template v-slot:activator="{ on }">
                  </template> -->
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    v-model="username"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                  ></v-text-field>
                  <v-text-field
                    label="Business Name"
                    name="login"
                    v-model="businessname"
                    prepend-icon="mdi-google-my-business"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="address"
                    label="Business Address"
                    name="login"
                    prepend-icon="mdi-google-my-business"
                    type="text"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="register()" color="primary">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    table: {},
    address: "",
    businessname: "",
    headers: [
      {
        text: "User Identifier",
        align: "start",
        sortable: false,
        value: "id"
      },
      { text: "Last Visit", value: "timestamp" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    username: "",
    password: "",
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
  methods: {
    register() {
      var component = this;
      component.$firebase
        .auth()
        .createUserWithEmailAndPassword(component.username, component.password).then(function(){
            component.router.go("/")
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          component.$firestore.collection("users").add({username: component.username, business: component.businessname, address: component.address })
          console.log(errorMessage);
        });
    }
  },
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
    //this.initialize();
  }
};
</script>