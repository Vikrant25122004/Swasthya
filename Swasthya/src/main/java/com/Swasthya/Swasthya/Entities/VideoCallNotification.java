package com.Swasthya.Swasthya.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoCallNotification {
    private String doctorEmail;
    private String patientPhonenumber;
    private String patientName;
    private String roomId;
}
