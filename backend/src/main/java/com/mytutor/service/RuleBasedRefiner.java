package com.mytutor.service;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RuleBasedRefiner {
    public String refine(String prompt,String intent,String depth,String source){
        String s=source.replaceAll("\\s+"," ").trim();
        String i=Objects.toString(intent,"Explanation").toLowerCase();
        if(i.contains("one")||i.contains("line")) return firstSentence(s);
        List<String> sentences=Arrays.stream(s.split("(?<=[.!?])\\s+")).filter(x->!x.isBlank()).toList();
        if(i.contains("summary")) return sentences.stream().limit(4).collect(Collectors.joining(" "));
        if(i.contains("use case")) return "Use cases:\n• "+sentences.stream().limit(4).collect(Collectors.joining("\n• "));
        if(i.contains("interview")) return "Interview questions:\n1. What is "+prompt+"?\n2. Explain its key concepts.\n3. Give a practical example.\n4. What are its advantages and limitations?";
        if(i.contains("learning")||i.contains("beginner")) return "Definition\n"+firstParagraph(s)+"\n\nKey points\n• "+sentences.stream().limit(5).collect(Collectors.joining("\n• "));
        return firstParagraph(s);
    }
    private String firstSentence(String s){String[] a=s.split("(?<=[.!?])\\s+");return a.length>0?a[0]:s;}
    private String firstParagraph(String s){return s.length()>1800?s.substring(0,1800)+"...":s;}
}
