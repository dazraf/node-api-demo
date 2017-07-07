# Simple instructions

1.  Install [Node.js](https://nodejs.org/en/).

    * Optional: Install [Yarn](https://yarnpkg.com/).

1.  Install [git](https://git-scm.com/).
1.  Create a [Google Cloud Platform project](https://console.cloud.google.com).
1.  Install the [Google Cloud SDK](https://cloud.google.com/sdk/).

    * After downloading the SDK, initialize it:

            gcloud init

1.  Clone the repository:

        git clone https://github.com/dazraf/node-api-demo.git

1.  Install dependencies using NPM or Yarn:

    * Using NPM:

            npm install

    * Using Yarn:

            yarn install

1.  Associate your credentials with Google Cloud beta tools
        gcloud beta auth application-default login

    * The first time your try running this, it will ask to install the respective beta tools. Accept the default options. When installed, rerun the above command.

1.  Start up the local Google DataStore emulator

        gcloud beta emulators datastore start --host-port=localhost:9000 --no-store-on-disk

    * The first time your try running this, it will ask to install the respective beta tools. Accept the default options. When installed, rerun the above command.

1. Setup your environment path for running Node to include the following environment variables:

        DATASTORE_EMULATOR_HOST = localhost:9000
        DATASTORE_PROJECT_ID = node-api-demo

I use Visual Studio Code editor - it's relatively trivial to create a new Debug configuration there with the respective environment variables:

```
{
  "version": "0.2.0",
  "configurations": [    
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceRoot}\\app.js",
      "env": {
        "DATASTORE_EMULATOR_HOST": "localhost:9000",
        "DATASTORE_PROJECT_ID": "node-api-demo"
      }
    }
  ]
}
```

1.  Start the app using NPM or Yarn:

    * Using NPM:

            npm start

    * Using Yarn:

            yarn start

    * Or using your editors built in NodeJS debugging configuration

1.  View the app at [http://localhost:8081](http://localhost:8081).

1.  Stop the app by pressing `Ctrl+C`.

1.  Deploy the app:

        gcloud app deploy

1.  View the deployed app at [https://YOUR_PROJECT_ID.appspot.com](https://YOUR_PROJECT_ID.appspot.com).