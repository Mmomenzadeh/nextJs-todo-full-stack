const mongoose = require("mongoose");

const ConectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return false;
    }

    await mongoose.connect(`${process.env.BASE_URL}`);
    console.log("Conect to db successfully");
  } catch (error) {
    console.log({ "Conecting to db hase error ! =>  ": error });
  }
};

export default ConectToDB;
