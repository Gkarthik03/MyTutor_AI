package com.mytutor.repository;
import com.mytutor.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface TopicRepository extends JpaRepository<Topic,Integer>{
    Optional<Topic> findFirstByTopicNameIgnoreCase(String name);
    List<Topic> findAllByOrderByTopicNameAsc();
}
