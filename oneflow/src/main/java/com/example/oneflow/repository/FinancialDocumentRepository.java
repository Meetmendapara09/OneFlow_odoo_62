package com.example.oneflow.repository;

import com.example.oneflow.entity.FinancialDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialDocumentRepository extends JpaRepository<FinancialDocument, Long> {
}
