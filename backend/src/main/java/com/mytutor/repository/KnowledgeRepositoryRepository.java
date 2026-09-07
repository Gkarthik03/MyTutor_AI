package com.mytutor.repository;
import com.mytutor.entity.KnowledgeRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface KnowledgeRepositoryRepository extends JpaRepository<KnowledgeRepository,Integer>{
    List<KnowledgeRepository> findByTopic_TopicId(Integer topicId);
}
