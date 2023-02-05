/*
 Make Page 구성

 (1) 카드 form 선택
 (2) 카드 유형 선택
 (3) 카드 입력 폼
 (4) 번들 생성 버튼 & 번들 입력 폼
 (5) 카드 추가, 수정, 삭제, 생성 버튼
 (6) 카드 List 보여주기
 */

// React import
import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Mui-Material components
import {
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
} from "@mui/material";
import Switch from "@mui/material/Switch";

// [Import - React-Redux]
import { useDispatch, useSelector } from "react-redux";
import { actAddCard, actEditCard, actDeleteCard } from "redux/actions/makeCardAction";

// Import - custom
import MakeCategory from "pages/make/form/makeCategory";
import MakeProblem from "pages/make/form/makeProblem";
import MakeGeneral from "pages/make/form/makeGeneral";
import MakeLink from "pages/make/form/makeLink";
import MakeBundle from "pages/make/form/makeBundle";
import MakeButton from "pages/make/form/makeButton";
import MakeCardList from "pages/make/form/makeCardList";

function Make() {
  // ==================== Data =================================
  // Data - global
  const { cardNo, cardList, editCardNumber } = useSelector((state) => state.makeReducer); // state 값 가져오기

  // Data - local
  // (1) 유형 선택 - 어떤 값은 선택햇는지 저장하는 state 값
  const [form, setForm] = useState("problem");

  // (2) category 선택
  // const [category, setCategory] = useState({
  //   type_1: "",
  //   type_2: "",
  // });

  // (3) form value 저장
  const [values, setValues] = useState({
    userId: "testID",
    feedTitle: "",
    feedContent: "",
    categoryId: 1,
    cardType: "card_problem",
    cardDescription: "",
    cardCommentary: "",
    cardno: null,
  });
  const [editCardIndex, setEditCardIndex] = useState(-1); // 선택된 카드 인덱스 저장

  // (4) Bundle Form && Toggle
  const [bundleToggle, setBundleToggle] = useState(false); // 번들 토글 버튼
  const [bundleForm, setBundleForm] = useState({
    userId: "testId",
    bundleThumbnail: "",
    bundleThumbnailText: "",
    feedTitle: "",
    feedContent: "",
  });

  // (*) Validation
  const [valid, setValid] = useState({
    isFeedTitle: false,
    isFeedContent: false,
    isCardCommentary: false,
  });

  // ==================== Function ==============================
  const dispatch = useDispatch();

  // state 초기화
  const initStateRender = () => {
    setValues({
      ...values,
      feedTitle: "",
      feedContent: "",
      cardCommentary: "",
      cardDescription: "",
    });

    // render 값 초기환
    document.querySelector("#problem-title").value = "";
    document.querySelector("#problem-content").value = "";
    document.querySelector("#problem-cardCommentary").value = "";
    document.querySelector("#problem-description").value = "";
  };
  // (1) 유형 선택 - 선택 결과를 저장하는 함수
  const handleChangeForm = (event) => {
    setForm(event.target.value);
  };

  // (2) category 선택 함수

  // (3) form value 저장 함수
  const handleChangeValues = (event, name, value) => {
    event.preventDefault();
    // const { name, value } = event.target;
    // console.log(name, value);
    setValues({ ...values, [name]: value });

    // valid
    const feedTitle = document.querySelector("#problem-title").value;
    const feedContent = document.querySelector("#problem-content").value;
    if (feedTitle.length === 0 && feedContent.length !== 0)
      setValid({ ...valid, isFeedTitle: true, isFeedContent: false });
    if (feedTitle.length !== 0 && feedContent.length === 0)
      setValid({ ...valid, isFeedTitle: false, isFeedContent: true });
    if (feedTitle.length === 0 && feedContent.length === 0)
      setValid({ ...valid, isFeedTitle: true, isFeedContent: true });
    if (feedTitle.length !== 0 && feedContent.length !== 0)
      setValid({ ...valid, isFeedTitle: false, isFeedContent: false });
  };

  // (4) bundle form 함수
  const handleBundleChange = (data) => {
    console.log(data.value);
    const { name, value } = data;
    setBundleForm({ ...bundleForm, [name]: value });
  };

  // (5) button 함수
  // 추가 버튼
  const handleValuesAdd = (e) => {
    e.preventDefault();

    // validation check
    const feedTitle = document.querySelector("#problem-title").value;
    const feedContent = document.querySelector("#problem-content").value;
    if (feedTitle.length === 0 || feedContent.length === 0) {
      alert("필수 입력 필요");
    } else {
      setValues({ ...values, cardno: cardNo });
      const result = actAddCard(values);
      dispatch(result);

      // 값 초기화
      initStateRender();
    }
  };

  // 수정 버튼
  const handleValuesEdit = (e) => {
    e.preventDefault();

    // 카드가 선택 되었을때만 동작
    if (editCardIndex !== -1) {
      const result = actEditCard(editCardIndex, values);
      dispatch(result);

      // 값 초기화
      initStateRender();
      setEditCardIndex(-1);
    }
  };

  // 삭제 버튼
  const handleValuesDelete = (e) => {
    e.preventDefault();

    // 카드가 선택 되었을때만 동작
    if (editCardIndex !== -1) {
      const result = actDeleteCard(editCardIndex);
      dispatch(result);

      // 값 초기화
      initStateRender();
    }
  };

  // 생성 버튼
  const handleValuesCreate = (e) => {
    e.preventDefault();

    console.log(cardList);
    console.log(bundleForm);

    if (
      bundleToggle &&
      (bundleForm.bundleThumbnail.length === 0 || bundleForm.bundleThumbnailText.length === 0)
    ) {
      alert("bundle 내용 없음");
    } else if (!bundleToggle && cardList.length === 0) {
      alert("bundle 생성만 하실 경우 bundle 제목과 내용을 입력해 주세요");
    } else {
      alert("정상 생성");
      dispatch({ type: "CARD_STORE_RESET" });
    }
  };

  // useEffect 함수
  useEffect(() => {
    setValues({ ...values, cardno: cardNo });
  }, [cardNo]);

  useEffect(() => {
    // Component가 화면에 나타남 === mount"
    // editCardNo가 변화하게 된다면
    // cardList에서 수정할 card 정보 불러오기
    if (editCardNumber !== -1) {
      const selectedTitle = cardList[editCardNumber].feedTitle;
      const selectedContent = cardList[editCardNumber].feedContent;
      const selectedCardCommentary = cardList[editCardNumber].cardCommentary;
      const selectedDescription = cardList[editCardNumber].cardDescription;
      // component data - 값 업데이트
      setValues({
        ...values,
        feedContent: selectedTitle,
        cardDescription: selectedContent,
        cardCommentary: selectedCardCommentary,
        feedTitle: selectedDescription,
      });

      // render 값 업데이트
      document.querySelector("#problem-title").value = selectedTitle;
      document.querySelector("#problem-content").value = selectedContent;
      document.querySelector("#problem-cardCommentary").value = selectedCardCommentary;
      document.querySelector("#problem-description").value = selectedDescription;

      // 수정할 card번호 다시 초기화
      setEditCardIndex(editCardNumber);
      dispatch({ type: "INIT_CARD_NO" });
    }

    // Component가 화면에 사라짐 === unmount
    // return () => {
    // };
  }, [editCardNumber]);

  // ==================== Return ==============================
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <FormControl>
        <FormLabel id="card-category-select">
          <Typography variant="h6">유형 선택</Typography>
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="card-category-radio-buttons"
          name="row-radio-buttons-group"
          // defaultChecked="problem"
          value={form}
          onChange={handleChangeForm}
        >
          <FormControlLabel value="problem" control={<Radio />} label="문제" />
          <FormControlLabel value="general" control={<Radio />} label="일반" />
          <FormControlLabel value="link" control={<Radio />} label="링크" />
        </RadioGroup>
      </FormControl>
      <MakeCategory />
      {form === "problem" && <MakeProblem handleChangeValues={handleChangeValues} />}
      {form === "general" && <MakeGeneral />}
      {form === "link" && <MakeLink />}
      <Box>
        <MDBox display="flex" alignItems="center" mt={3} lineHeight={1}>
          <MDTypography variant="h6">번들로 묶기</MDTypography>
          <Switch checked={bundleToggle} onChange={() => setBundleToggle(!bundleToggle)} />
        </MDBox>
      </Box>
      <MakeBundle selected={bundleToggle} handleBundle={handleBundleChange} />
      <MakeButton
        handleValuesAdd={handleValuesAdd}
        handleValuesEdit={handleValuesEdit}
        handleValuesDelete={handleValuesDelete}
        handleValuesCreate={handleValuesCreate}
      />
      <MakeCardList />
    </DashboardLayout>
  );
}

export default Make;
