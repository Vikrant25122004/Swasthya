package com.Swasthya.Swasthya.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Swasthya.Swasthya.Entities.PastPatients;
import java.util.List;


@Repository
public interface PastPatientRepo extends MongoRepository<PastPatients,ObjectId>{
    PastPatients findBypatientemail(String patientemail);
    List<PastPatients> findByDoctoremail(String doctoremail);
}