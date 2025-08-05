package com.Swasthya.Swasthya.Entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Doctors {

    @Id
    private ObjectId id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String address;
    private String phonenumber;
    private String speciality;
    private String password;
    private String hospital_Clinic_name;
    private String experience;
    private String degreepdfname;
    private String degreepdftype;
    private byte[] degreepdfbyte;
    private String profilepicname;
    private String profilepictype;
    private byte[] profilepicbyte;
    private String fees;
    private Float ratings;
    private String status;
    private boolean book = false;

    
}
