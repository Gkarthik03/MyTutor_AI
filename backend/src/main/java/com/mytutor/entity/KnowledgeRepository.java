package com.mytutor.entity;
import jakarta.persistence.*;

@Entity @Table(name="knowledge_repository")
public class KnowledgeRepository {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) @Column(name="knowledge_id") private Integer knowledgeId;
    @Column(name="document_name",nullable=false) private String documentName;
    @Column(name="document_type") private String documentType;
    @Column(name="file_path",nullable=false) private String filePath;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="topic_id",nullable=false) private Topic topic;
    public Integer getKnowledgeId(){return knowledgeId;} public String getDocumentName(){return documentName;}
    public String getDocumentType(){return documentType;} public String getFilePath(){return filePath;}
    public Topic getTopic(){return topic;}
}
