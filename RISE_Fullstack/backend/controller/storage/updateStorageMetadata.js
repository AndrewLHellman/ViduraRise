const { s3 } = require("../../common_func");
const { update } = require("../../database_services/mongo_crud");

const cal_bucket_usage_imgcount = async (req, res) => {
  try {
    let { _id, bucketName } = req.body;
    const params = {
      Bucket: bucketName,
    };
    await s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error("Error listing objects:", err);
      } else {
        let totalSizeBytes = 0;
        let img_count = 0;

        data.Contents.forEach((object) => {
            // console.log(object);
            img_count += 1;
            totalSizeBytes += object.Size;
        });

        let totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
        totalSizeMB = totalSizeMB.toString() + " MB";

        let query_params = {
          modelName: "storage_data",
          where: { _id: _id },
          updateData: { imagecount: img_count, usage: totalSizeMB },
        };

        update(query_params);

        return res.json({
          status: 1,
          msgType: "success",
          data: { imagecount: img_count, usage: totalSizeMB },
        });
      }
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

const list_of_s3_buckets = async () => {
  const bucket_list = await new Promise((resolve, reject) => {
    s3.listBuckets((err, data) => {
      if (err) {
        console.error("Error listing S3 buckets:", err);
        reject(err);
      } else {
        console.log("S3 Buckets:");
        const buckets = data.Buckets.map((bucket) => {
          console.log(bucket.Name);
          return bucket.Name;
        });
        resolve(buckets);
      }
    });
  });
};

module.exports = {
  list_of_s3_buckets,
  cal_bucket_usage_imgcount,
};
