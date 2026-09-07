package com.mytutor.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import jakarta.annotation.PostConstruct;
import java.util.*;

@Service
public class AiService {
    private final RestClient client=RestClient.create(); private final ObjectMapper mapper=new ObjectMapper();
    private final RuleBasedRefiner fallback;
    @Value("${app.ai.provider:ollama}") String provider;
    @Value("${app.ai.ollama-url:http://localhost:11434/api/chat}") String ollamaUrl;
    @Value("${app.ai.ollama-model:llama3.2:3b}") String ollamaModel;
    @Value("${app.ai.gemini-api-key:}") String geminiKey;
    @Value("${app.ai.gemini-model:gemini-2.5-flash}") String geminiModel;
    public AiService(RuleBasedRefiner fallback){this.fallback=fallback;}


    public record Result(String text,boolean aiUsed){}
    public Result refine(String prompt,String intent,String level,String tech,String framework,String audience,String depth,String source){
        String instruction="""
        You are MyTutor AI, a QEA learning assistant.
        Use ONLY the supplied source material. Do not invent facts.
        User request: %s
        Output intent: %s
        Learning level: %s
        Technology: %s
        Framework: %s
        Audience: %s
        Depth: %s
        Source material:
        %s
        Follow the output intent exactly. If the request is one-line, return exactly one concise sentence.
        For summaries use concise structure. For examples/use cases/interview questions use headings and bullets.
        """.formatted(prompt,intent,level,tech,framework,audience,depth,source);
        try{
            String out="";
            if("ollama".equalsIgnoreCase(provider)) out=ollama(instruction);
            else if("gemini".equalsIgnoreCase(provider)&&!geminiKey.isBlank()) out=gemini(instruction);
            if(out!=null&&!out.isBlank())return new Result(out.trim(),true);
        }catch(Exception e){
            System.out.println("AI provider failed: "+e.getMessage());
        }
        return new Result(fallback.refine(prompt,intent,depth,source),false);
    }
    private String ollama(String text)throws Exception{
        Map<String,Object> body=Map.of("model",ollamaModel,"stream",false,
            "messages",List.of(Map.of("role","user","content",text)));
        String json=client.post().uri(ollamaUrl).contentType(MediaType.APPLICATION_JSON).body(body).retrieve().body(String.class);
        return mapper.readTree(json).path("message").path("content").asText("");
    }
    private String gemini(String text)throws Exception{
        String url="https://generativelanguage.googleapis.com/v1beta/models/"+geminiModel+":generateContent?key="+geminiKey;
        Map<String,Object> body=Map.of("contents",List.of(Map.of("parts",List.of(Map.of("text",text)))));
        String json=client.post().uri(url).contentType(MediaType.APPLICATION_JSON).body(body).retrieve().body(String.class);
        JsonNode n=mapper.readTree(json);
        return n.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText("");
    }

}
