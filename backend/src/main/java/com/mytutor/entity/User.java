package com.mytutor.entity;
import jakarta.persistence.*;

@Entity @Table(name="user")
public class User {
    @Id @Column(name="user_id") private String userId;
    @Column(nullable=false) private String password;
    @Column(nullable=false, unique=true) private String email;
    @Column(name="employee_id") private String employeeId;
    @Column(nullable=false) private String name;
    public String getUserId(){return userId;} public void setUserId(String v){userId=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getEmployeeId(){return employeeId;} public void setEmployeeId(String v){employeeId=v;}
    public String getName(){return name;} public void setName(String v){name=v;}
}
