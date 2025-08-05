package com.Swasthya.Swasthya.Entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Prescriptions {
   @Id
   private ObjectId id;
   private String doctorname;
   private String doctoremail;
   private String patientname;
   private String problem;
   private String prescriptiontype;
   private String prescriptionname;
   private byte[] prescriptionbyte;
   private String orderid;
   private String amount;
   private boolean paid = false;


}
