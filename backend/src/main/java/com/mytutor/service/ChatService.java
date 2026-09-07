package com.mytutor.service;

import com.mytutor.dto.GenerateRequest;
import com.mytutor.entity.*;
import com.mytutor.repository.*;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final KnowledgeService knowledge;
    private final AiService ai;
    private final ConversationRepository conversations;
    private final UserRepository users;
    private final TopicRepository topics;

    public ChatService(
            KnowledgeService k,
            AiService a,
            ConversationRepository c,
            UserRepository u,
            TopicRepository t) {

        knowledge = k;
        ai = a;
        conversations = c;
        users = u;
        topics = t;
    }

    public Object[] generate(GenerateRequest r, String userId) {

        long totalStart = System.currentTimeMillis();

        System.out.println("\n========== MYTUTOR REQUEST ==========");
        System.out.println("[1] Request received");

        // Knowledge retrieval
        long start = System.currentTimeMillis();

        var found = knowledge.retrieve(
                r.prompt(),
                r.technology(),
                r.framework()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "Requested topic not found in the knowledge repository."
                )
        );

        System.out.println(
                "[2] Knowledge retrieval completed in "
                        + (System.currentTimeMillis() - start)
                        + " ms"
        );

        // AI / Rule-based refinement
        start = System.currentTimeMillis();

        var refined = ai.refine(
                r.prompt(),
                r.outputIntent(),
                r.learningLevel(),
                r.technology(),
                r.framework(),
                r.audience(),
                r.depth(),
                found.content()
        );

        System.out.println(
                "[3] AI/Rule refinement completed in "
                        + (System.currentTimeMillis() - start)
                        + " ms"
        );

        // User lookup
        start = System.currentTimeMillis();

        User u = users.findById(userId).orElse(null);

        System.out.println(
                "[4] User lookup completed in "
                        + (System.currentTimeMillis() - start)
                        + " ms"
        );

        // Topic lookup
        start = System.currentTimeMillis();

        Topic t = topics
                .findFirstByTopicNameIgnoreCase(found.topic())
                .orElse(null);

        System.out.println(
                "[5] Topic lookup completed in "
                        + (System.currentTimeMillis() - start)
                        + " ms"
        );

        // Conversation save
        if (u != null) {

            start = System.currentTimeMillis();

            Conversation c = new Conversation();
            c.setPromptText(r.prompt());
            c.setGeneratedResponse(refined.text());
            c.setUser(u);
            c.setTopic(t);

            conversations.save(c);

            System.out.println(
                    "[6] Conversation save completed in "
                            + (System.currentTimeMillis() - start)
                            + " ms"
            );
        }

        System.out.println(
                "[7] TOTAL REQUEST TIME: "
                        + (System.currentTimeMillis() - totalStart)
                        + " ms"
        );

        System.out.println("=====================================\n");

        return new Object[]{
                refined.text(),
                found.topic(),
                found.source(),
                refined.aiUsed()
        };
    }
}