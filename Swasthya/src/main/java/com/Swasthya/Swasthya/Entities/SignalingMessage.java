package com.Swasthya.Swasthya.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignalingMessage {
    private String from;
    private String to;
    private String type;    
}
