import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Link, useHistory, useParams } from "react-router-dom";
import Article from "patient-portal-components/Dashboard/Article.js";
import { getLoggedinUserId, getUser, setLastPetId } from "patient-portal-utils/Service";
import debounce from 'lodash.debounce';
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Header from "patient-portal-components/Header/Header.js";


const ArticlesList = () => {

  const [searchData, setSearchData] = useState("");
  const [articles, setArticles] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);



  const lastScrollTop = useRef(0);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isBottom, setIsBottom] = useState(false);
  const [formData, setFormData] = useState({});
  const getArticleList = useStoreActions((actions) => actions.Article.getArticleList);
  const response = useStoreState((state) => state.Article.response);


  const debounceFunc = useCallback(debounce((nextValue) => getSearchResult(nextValue), 500), [])

  const getSearchResult = async (val) => {
    await getArticleList({ Type: "GET", search_key: val, query: { page: page, pagesize: 20 } });
  }

  useEffect(async () => {
    //  if (searchData) {
    setNextPageUrl(null);
    setCurrentPage(1);
    setPage(1);

    await getArticleList({ Type: "GET", search_key: searchData, query: { page:process.env.REACT_APP_FIRST_PAGE , pagesize: 20} });
    // props.onLoad();
    //  }
    window.addEventListener('scroll', (e) => handleScroll(e), true);
    return () => {
      window.removeEventListener('scroll', (e) => handleScroll(e))
    };
  }, []);

  const handleScroll = useCallback((e) => {
    const scrollTop = parseInt(Math.max(e?.srcElement?.scrollTop));
    let st = scrollTop;
    if (st > lastScrollTop.current) {
      if (scrollTop + window.innerHeight + 50 >= e?.srcElement?.scrollHeight) {
        setIsBottom(true);
      }
    } else {
      setIsBottom(false);
    }
    setTimeout(() => {
      lastScrollTop.current = st <= 0 ? 0 : st;
    }, 0)
  }, []);

  useEffect(() => {
    if (isBottom && nextPageUrl) {
      setPage(parseInt(currentPage + 1));
    }
  }, [isBottom, nextPageUrl]);

  useEffect(async () => {
    if (page && page > 1) {
         getArticleList({ Type: "GET", search_key:searchData, query: { page:page, pagesize: 20 } });
    }
}, [page]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.article) {

          const { current_page, next_page_url, per_page } = data.article;

          setCurrentPage(current_page);
          setNextPageUrl(next_page_url);
          setPerPage(per_page);

          let serverRespone = data.article.data;
          if (current_page == 1) {
            setRecords(serverRespone);
          }
          else {
            serverRespone = [...records, ...serverRespone];
            setRecords(serverRespone);
          }
          setIsBottom(false);
        }

      }
    }
  }, [response]);

  const onChangeHandler = (e) => {
    setSearchData(e.target.value);
    debounceFunc(e.target.value);
  }



  return (
    <React.Fragment>
      <div className="content_outer">

        <Sidebar activeMenu="dashboard" />
        <div className="right_content_col">
          <main>
            <Header
              backEnabled={false}
              heading={`Articles`}
              hasBtn={false}
              hasInput={true}
              value={searchData}
              onChangeHandler={onChangeHandler}
            />
            <div className="articleOuter">
              <Article data={records} />
            </div>
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default ArticlesList;
