import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/wallet";

export const DatabaseConfig = {
    module: MongooseModule.forRoot(CONNECTION_STRING, {
        onConnectionCreate: (connection: Connection) => {
            connection.on("connected", () => console.log("connected"));
            connection.on("open", () => console.log("open"));
            connection.on("disconnected", () => console.log("disconnected"));
            connection.on("reconnected", () => console.log("reconnected"));
            connection.on("disconnecting", () => console.log("disconnecting"));

            return connection;
        },
    }),
};

export default DatabaseConfig;
