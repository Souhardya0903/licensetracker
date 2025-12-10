/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.springframework.web.bind.annotation.PostMapping
 *  org.springframework.web.bind.annotation.RequestBody
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RestController
 */
package com.project.controller;

import com.project.ai.ChatAssistant;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value={"/api/ai"})
public class AIController {
    private final ChatAssistant chatAssistant;

    public AIController(ChatAssistant chatAssistant) {
        this.chatAssistant = chatAssistant;
    }

    @PostMapping(value={"/summary"})
    public String getSummary(@RequestBody String prompt) {
        String chatId = UUID.randomUUID().toString();
        return this.chatAssistant.chat(chatId, prompt);
    }
}
