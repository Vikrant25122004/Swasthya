package com.Swasthya.Swasthya.Entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PastPatients {
    @Id
    private ObjectId id;
    private String patientname;
    private String patientemail;
    private String doctorname;
    private String doctoremail;
    private String problem;
    private String prescripname;
    private String prescriptype;
    private byte[] prescripbyte;
    private boolean paid = false;
    private float ratings;
    
}
