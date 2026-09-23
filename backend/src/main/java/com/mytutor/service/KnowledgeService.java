package com.mytutor.service;

import com.mytutor.entity.*;
import com.mytutor.repository.*;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class KnowledgeService {
    private final TopicRepository topics; private final KnowledgeRepositoryRepository docs; private final Path base;
    public KnowledgeService(TopicRepository topics,KnowledgeRepositoryRepository docs,
        @Value("${app.knowledge.base-dir:./knowledge}") String baseDir){
        this.topics=topics;this.docs=docs;this.base=Paths.get(baseDir).toAbsolutePath().normalize();
    }
    public record Result(String topic,String source,String content){}
    public Optional<Result> retrieve(String prompt,String technology,String framework){
        String q=(prompt+" "+Objects.toString(technology,"")+" "+Objects.toString(framework,"")).toLowerCase();
//        System.out.println("PROMPT = " + prompt);
//        System.out.println("QUERY = " + q);
//        System.out.println("TOPICS = " +
//                topics.findAll().stream()
//                        .map(Topic::getTopicName)
//                        .toList());
        Topic best=topics.findAll().stream()
            .filter(t->q.contains(t.getTopicName().toLowerCase()))
            .findFirst().orElse(null);
        if(best==null){
            System.out.println("No Topic match found");
            return Optional.empty();
        }

        List<KnowledgeRepository> rs=docs.findByTopic_TopicId(best.getTopicId());
        String content=rs.stream().map(this::read).filter(s->!s.isBlank()).collect(Collectors.joining("\n\n--- SOURCE ---\n\n"));
        if(content.isBlank()){
            System.out.println("Topic found but file content is empty");
            System.out.println("base directory = "+base);
            System.out.println("Files found = "+rs.stream().map(KnowledgeRepository::getFilePath).toList());

            return Optional.empty();}
        return Optional.of(new Result(best.getTopicName(),rs.get(0).getDocumentName(),content));
    }
    private String read(KnowledgeRepository d){
        try{
            Path p=Paths.get(d.getFilePath()); if(!p.isAbsolute())p=base.resolve(p).normalize();
            if(!Files.exists(p))return "";
            if(p.toString().toLowerCase().endsWith(".pdf")){
                try(var pdf=Loader.loadPDF(p.toFile())){return new PDFTextStripper().getText(pdf);}
            }
            return Files.readString(p,StandardCharsets.UTF_8);
        }catch(Exception e){
            System.out.println("File Read Error = "+e.getClass().getName());
            System.out.println("File Read Message = "+e.getMessage());
            e.printStackTrace();
            return "";}
    }
}
