const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3"); 

const allstorage = async (req, res) => {
  try {
    const client = new S3Client({ credentials :{ 
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
        },
        region: "us-east-1"
    });
    const input = {
      Bucket: "mizzou-lab-2", // required
    };
    const command = new ListObjectsCommand(input);
    const response = await client.send(command);
    console.log(response.Contents[0].Key)
    let data = []
    for (let i = 0; i < response.Contents.length; i++) {
        data.push(response.Contents[i].Key)
        // console.log(response.Contents[i].Key);
    }
    return res.json({
      status: 1,
      msgType: "success",
      data: data,
    });
    
  } catch (error) {
    console.log(error);
    return res.json({
      status: 0,
      msgType: "error",
      msg: `Error message: ${error.toString()}`,
    });
  }
};
module.exports = { allstorage };
