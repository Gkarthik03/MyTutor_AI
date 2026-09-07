package com.mytutor.dto;
import jakarta.validation.constraints.NotBlank;
public record GenerateRequest(@NotBlank String prompt,String outputIntent,String learningLevel,
String technology,String framework,String audience,String depth){}
