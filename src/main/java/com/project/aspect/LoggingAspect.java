/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  org.aspectj.lang.JoinPoint
 *  org.aspectj.lang.ProceedingJoinPoint
 *  org.aspectj.lang.annotation.AfterThrowing
 *  org.aspectj.lang.annotation.Around
 *  org.aspectj.lang.annotation.Aspect
 *  org.aspectj.lang.annotation.Pointcut
 *  org.slf4j.Logger
 *  org.slf4j.LoggerFactory
 *  org.springframework.stereotype.Component
 */
package com.project.aspect;

import java.util.Arrays;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Pointcut(value="within(@org.springframework.stereotype.Repository *) || within(@org.springframework.stereotype.Service *) || within(@org.springframework.web.bind.annotation.RestController *)")
    public void springBeanPointcut() {
    }

    @AfterThrowing(pointcut="springBeanPointcut()", throwing="e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        this.log.error("Exception in {}.{}() with cause = '{}' and exception = '{}'", new Object[]{joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName(), e.getCause() != null ? e.getCause() : "NULL", e.getMessage(), e});
    }

    @Around(value="springBeanPointcut()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        if (this.log.isTraceEnabled()) {
            this.log.trace("Enter: {}.{}() with argument[s] = {}", new Object[]{joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName(), Arrays.toString(joinPoint.getArgs())});
        }
        try {
            Object result = joinPoint.proceed();
            if (this.log.isTraceEnabled()) {
                this.log.trace("Exit: {}.{}() with result = {}", new Object[]{joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName(), result});
            }
            return result;
        }
        catch (IllegalArgumentException e) {
            this.log.error("Illegal argument: {} in {}.{}()", new Object[]{Arrays.toString(joinPoint.getArgs()), joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName()});
            throw e;
        }
    }
}
