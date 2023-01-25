package com.ssafy.bundler.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.bundler.domain.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {
}
