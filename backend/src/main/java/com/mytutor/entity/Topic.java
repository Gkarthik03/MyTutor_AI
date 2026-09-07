package com.mytutor.entity;
import jakarta.persistence.*;

@Entity @Table(name="topic")
public class Topic {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="topic_id") private Integer topicId;
    @Column(name="topic_name", nullable=false) private String topicName;
    private String description;
    public Integer getTopicId(){return topicId;} public void setTopicId(Integer v){topicId=v;}
    public String getTopicName(){return topicName;} public void setTopicName(String v){topicName=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
}
