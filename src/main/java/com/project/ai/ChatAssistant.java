/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  dev.langchain4j.service.MemoryId
 *  dev.langchain4j.service.SystemMessage
 *  dev.langchain4j.service.UserMessage
 */
package com.project.ai;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface ChatAssistant {
    @SystemMessage(value={"You are a support assistant for the 'Certify' application.", "Your goal is to help users get information about registered devices and software licenses.", "Before answering, you MUST use the available tools to fetch up-to-date information.", "If a tool provides information, base your answer on that information.", "If the user asks a question you cannot answer with your tools (e.g., 'Tell me a joke'),", "politely state that you can only help with Certify matters.", "Keep your answers concise and easy to understand. Use markdown for formatting lists."})
    public String chat(@MemoryId String var1, @UserMessage String var2);
}
