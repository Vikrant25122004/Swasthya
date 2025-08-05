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
public class Patient {
    
    @Id
    private ObjectId id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String address;
    private String phonenumber;
    private String password;
    private String prescriptionpdf;
    private String prescriptiontype;
    private byte[] prescriptionbyte;
    
}
