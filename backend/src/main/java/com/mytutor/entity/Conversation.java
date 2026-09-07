package com.mytutor.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="conversation")
public class Conversation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="conversation_id") private Integer conversationId;
    @Column(name="created_date") private LocalDateTime createdDate;
    @Lob @Column(name="generated_response",columnDefinition="LONGTEXT") private String generatedResponse;
    @Lob @Column(name="prompt_text",columnDefinition="LONGTEXT") private String promptText;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="topic_id") private Topic topic;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id") private User user;
    @PrePersist void createDate(){createdDate=LocalDateTime.now();}
    public Integer getConversationId(){return conversationId;} public LocalDateTime getCreatedDate(){return createdDate;}
    public String getGeneratedResponse(){return generatedResponse;} public String getPromptText(){return promptText;}
    public Topic getTopic(){return topic;} public User getUser(){return user;}
    public void setGeneratedResponse(String v){generatedResponse=v;} public void setPromptText(String v){promptText=v;}
    public void setTopic(Topic v){topic=v;} public void setUser(User v){user=v;}
}
