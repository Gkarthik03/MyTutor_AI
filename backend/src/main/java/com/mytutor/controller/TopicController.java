package com.mytutor.controller;
import com.mytutor.repository.TopicRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/topics")
public class TopicController {
    private final TopicRepository repo; public TopicController(TopicRepository r){repo=r;}
    @GetMapping public List<?> all(){return repo.findAllByOrderByTopicNameAsc().stream().map(t->Map.of(
        "topicId",t.getTopicId(),"topicName",t.getTopicName(),"description",Objects.toString(t.getDescription(),""))).toList();}
}
