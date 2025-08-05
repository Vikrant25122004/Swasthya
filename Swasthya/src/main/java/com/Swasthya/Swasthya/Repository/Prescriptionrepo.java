package com.Swasthya.Swasthya.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Swasthya.Swasthya.Entities.Prescriptions;
import java.util.List;
import java.util.Optional;


@Repository
public interface Prescriptionrepo extends MongoRepository<Prescriptions, ObjectId> {
    Prescriptions findByPatientname(String patientname);
    <Optional>Prescriptions findById(ObjectId id);
    Prescriptions findByorderid(String orderid);
}
