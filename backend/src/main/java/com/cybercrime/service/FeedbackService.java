package com.cybercrime.service;

import com.cybercrime.dto.FeedbackRequest;

public interface FeedbackService {
    void submitFeedback(Long complaintId, FeedbackRequest request);
}
