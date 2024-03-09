import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

/**


{
    "password":"student123",
    "student": {
        "name": {
            "firstName": "Mr. student1",
            "middleName": "Doe",
            "lastName": "Smith"
        },
        "gender": "male",
        "dateOfBirth": "1995-05-15",
        "email": "student1@example.com",
        "contactNo": "9876543210",
        "emergencyContactNo": "1234567890",
        "bloodGroup": "A+",
        "presentAddress": "123 Main Street, Cityville",
        "permanentAddress": "456 Oak Avenue, Townsville",
        "guardian": {
            "fatherName": "Robert Smith",
            "fatherOccupation": "Engineer",
            "fatherContactNo": "9876543211",
            "motherName": "Alice Smith",
            "motherContactNo": "9876543212",
            "motherOccupation": "Teacher"
        },
        "localGuardian": {
            "name": "Laura Johnson",
            "contactNo": "9876543213",
            "occupation": "Doctor",
            "relationShipWithStudent": "Family Friend",
            "address": "789 Pine Street, Villagetown"
        },
        "profileImg": "path/to/profile-image.jpg",
        "admittedSemester":"6569483cf7b15c3880ae141a",
        "academicDepartment":"657bec88d07b33fb506279e2"
    }
}


 */
