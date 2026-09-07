package com.mytutor.controller;
import com.mytutor.dto.GenerateRequest;
import com.mytutor.service.ChatService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chat; public ChatController(ChatService c){chat=c;}
    @PostMapping("/generate") public ResponseEntity<?> generate(@Valid @RequestBody GenerateRequest r,HttpSession s){
        Object id=s.getAttribute("userId");
        if(id==null)return ResponseEntity.status(401).body(Map.of("message","Please log in first."));
        try{
            Object[] x=chat.generate(r,id.toString());
            return ResponseEntity.ok(Map.of("response",x[0],"topic",x[1],"source",x[2],"aiUsed",x[3]));
        }catch(IllegalArgumentException e){return ResponseEntity.status(404).body(Map.of("message",e.getMessage()));}
    }
}
