/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  dev.langchain4j.memory.chat.MessageWindowChatMemory
 *  dev.langchain4j.model.chat.ChatLanguageModel
 *  dev.langchain4j.model.googleai.GoogleAiGeminiChatModel
 *  dev.langchain4j.service.AiServices
 *  dev.langchain4j.store.memory.chat.ChatMemoryStore
 *  dev.langchain4j.store.memory.chat.InMemoryChatMemoryStore
 *  org.springframework.beans.factory.annotation.Value
 *  org.springframework.context.annotation.Bean
 *  org.springframework.context.annotation.Configuration
 */
package com.project.ai;

import com.project.ai.ChatAssistant;
import com.project.ai.LicenseTrackerTools;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import dev.langchain4j.store.memory.chat.InMemoryChatMemoryStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {
    @Bean
    public ChatMemoryStore chatMemoryStore() {
        return new InMemoryChatMemoryStore();
    }

    @Bean
    public ChatLanguageModel chatLanguageModel(@Value(value="${gemini.api.key}") String apiKey) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("YOUR_GEMINI_API_KEY")) {
            throw new IllegalStateException("Error: GEMINI_API_KEY environment variable is not set or is a placeholder. Please set it in your IDE's Run Configuration or as a system environment variable.");
        }
        return GoogleAiGeminiChatModel.builder().apiKey(apiKey).modelName("gemini-2.0-flash").temperature(Double.valueOf(0.3)).maxOutputTokens(Integer.valueOf(1000)).build();
    }

    @Bean
    public ChatAssistant chatAssistant(ChatLanguageModel chatLanguageModel, ChatMemoryStore chatMemoryStore, LicenseTrackerTools licenseTrackerTools) {
        return (ChatAssistant)AiServices.builder(ChatAssistant.class).chatLanguageModel(chatLanguageModel).chatMemoryProvider(chatId -> MessageWindowChatMemory.builder().chatMemoryStore(chatMemoryStore).maxMessages(Integer.valueOf(20)).id(chatId).build()).tools(new Object[]{licenseTrackerTools}).build();
    }
}
