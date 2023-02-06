package com.ssafy.bundler.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.bundler.domain.User;
import com.ssafy.bundler.dto.stat.StatCategoryCountDto;
import com.ssafy.bundler.dto.stat.StatCategoryDto;
import com.ssafy.bundler.dto.stat.StatTotalCountDto;
import com.ssafy.bundler.repository.FeedRepository;
import com.ssafy.bundler.repository.UserRepository;

@Service
public class StatService {
	@Autowired
	UserRepository userRepository;
	@Autowired
	FeedRepository feedRepository;
	@Transactional
	public StatCategoryDto[] getCategoryStat(Long userId){
		User user = userRepository.findById(userId).orElseThrow(
			()->new IllegalArgumentException("해당 사용를 찾을 수 없습니다.")
		);
		List<StatCategoryCountDto> res = feedRepository.findFeedJoinCategory(user.getUserId());

		Map<Long,StatCategoryDto> preResult = new HashMap<>();

		StatTotalCountDto cnt = feedRepository.findCountByUser(user.getUserId());
		if(cnt.getCount() == 0L) return null;
		for (StatCategoryCountDto re : res) {
			Long categoryParentId = re.getCategoryParentId();
			if (categoryParentId == null) {

				Long count = re.getCategoryMakeCount();
				Long categoryId = re.getCategoryId();
				String categoryName = re.getCategoryName();

				preResult.put(categoryId,
					StatCategoryDto.builder()
						.categoryMakeCount(count)
						.categoryName(categoryName)
						.subCategories(new ArrayList<>())
						.build());

			}
		}
		for (StatCategoryCountDto re : res) {
			Long count = re.getCategoryMakeCount();
			String categoryName = re.getCategoryName();
			Long categoryParentId = re.getCategoryParentId();
			if (categoryParentId != null) {

				StatCategoryDto stat = preResult.get(categoryParentId);

				StatCategoryDto subStat = StatCategoryDto.builder()
					.categoryMakeCount(count)
					.categoryName(categoryName)
					.build();
				stat.getSubCategories().add(subStat);
				stat.setCategoryMakeCount(stat.getCategoryMakeCount() + count);
			}
		}
		for (StatCategoryCountDto re : res) {
			Long categoryParentId = re.getCategoryParentId();
			Long categoryId = re.getCategoryId();
			StatCategoryDto stat = preResult.get(categoryId);
			if (categoryParentId == null) {
				double pProportion = Math.round(stat.getCategoryMakeCount() / (double)cnt.getCount() * 100);
				stat.setProportion(pProportion);

				for (StatCategoryDto cStat : stat.getSubCategories()
				) {
					double cProportion = Math.round(cStat.getCategoryMakeCount() / (double)stat.getCategoryMakeCount()*100);
					cStat.setProportion(cProportion);
				}
			}
		}


		return preResult.values().toArray(new StatCategoryDto[0]);
	}
	@Transactional
	public String getActivityStat(Long userId){
		User user = userRepository.findById(userId).orElseThrow(
			()->new IllegalArgumentException("해당 사용를 찾을 수 없습니다.")
		);
		return user.getCreatedAt().toLocalDate().toString();
	}
}
