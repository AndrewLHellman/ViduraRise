const { cipher, decipher, toB64padded } = require("../common_functions");
const buffertrim = require("buffertrim");

const userSemCommand = async (req, res) => {
  try {
    let { command, flag} = req.body;
    console.log(req.body);
    if (flag==0){
      var bufCmdB64padded = toB64padded(command, 16); // Base64 encoding and Zero padding
      var ciphertextB64 = cipher.update(bufCmdB64padded, "", "base64"); // Encryption, Base64 encoding of ciphertext
      ciphertextB64 += cipher.final("base64");
      console.log("ciphertext is:", ciphertextB64);
      return res.json({
        status: 1,
        msgType: "success",
        data: { data: ciphertextB64, flag : 1 },
      });
    }
    else{
        var bufCmdB64padded = Buffer.concat([
        // Base64 decoding of ciphertext, decryption
        decipher.update(command, "base64"),
        decipher.final(),
      ]);
      var bufCmdB64 = buffertrim.trimEnd(bufCmdB64padded); // Unpadding (unreliable)
      var bufCmd = Buffer.from(bufCmdB64.toString("utf8"), "base64"); // Base64 decoding
      console.log("original string is:", bufCmd.toString("utf8"));  
      return res.json({
        status: 1,
        msgType: "success",
        data: { data: bufCmd.toString("utf8"), flag : 0 },
      });
    }
  } 
  
  catch (error) {
    console.log(error);
    return res.json({
      status: 0,
      msgType: "error",
      msg: `Error message: ${error.toString()}`,
    });
  }

};

module.exports = { userSemCommand };
