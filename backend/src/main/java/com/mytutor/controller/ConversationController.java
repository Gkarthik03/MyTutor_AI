package com.mytutor.controller;
import com.mytutor.repository.ConversationRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import java.util.*;

@RestController @RequestMapping("/api/conversations")
public class ConversationController {
    private final ConversationRepository repo; public ConversationController(ConversationRepository r){repo=r;}
    @GetMapping public ResponseEntity<?> recent(HttpSession s){
        Object id=s.getAttribute("userId"); if(id==null)return ResponseEntity.status(401).build();
        return ResponseEntity.ok(repo.findTop20ByUser_UserIdOrderByCreatedDateDesc(id.toString()).stream().map(c->Map.of(
            "conversationId",c.getConversationId(),"prompt",c.getPromptText(),"response",c.getGeneratedResponse(),
            "createdDate",c.getCreatedDate(),"topic",c.getTopic()==null?"":c.getTopic().getTopicName())).toList());
    }
}
