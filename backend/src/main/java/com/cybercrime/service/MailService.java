package com.cybercrime.service;

public interface MailService {
    void sendMail(String to, String subject, String content);
}
