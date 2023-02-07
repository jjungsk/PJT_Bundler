package com.ssafy.bundler.dto;

import java.io.Serializable;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponseDto implements Serializable {

	String userNickname;

	// public AuthResponseDto fromDto(User userEntity) {
	// 	return AuthResponseDto.builder()
	// 		.userNickname(userEntity.getUserNickname())
	// 		.build();
	// }

}