import { Loader, List } from "components";
import { Button, Stack } from "react-bootstrap";
import { useFetch } from "hooks";
import { useState, useEffect } from "react";
import { createSearchParams } from "react-router-dom";
import ReviewInfo from "./ReviewInfo";
import ReviewToolBar from "./ReviewToolBar";

export default function ReviewList(props) {
  const url = "https://e-shop.free.mockoapp.net/products/1/reviews";
  const init = { start: 0, limit: 10, search: "", sort: "newest" };

  const [searchParam, setSearchParam] = useState(init);
  const [viewMore, setViewMore] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [fetchUrl, setFetchUrl] = useState(generateUrl());
  const { data, isLoading, error } = useFetch(fetchUrl);

  function onViewAllReviews() {
    setViewMore(true);
    setSearchParam((old) => {
      return { ...old, start: old.start + old.limit };
    });
  }

  function onSearchParamsChange(searchParam) {
    setSearchParam((old) => {
      return { ...old, ...searchParam };
    });
  }

  function generateUrl() {
    return `${url}?${createSearchParams(searchParam)}`;
  }

  useEffect(() => {
    setFetchUrl(generateUrl());
  }, [searchParam]);

  useEffect(() => {
    if (!data) return;
    setReviewList((oldReviewList) => {
      if (viewMore) {
        setViewMore(false);
        return oldReviewList.concat(data.results);
      }
      return data.results;
    });
  }, [data]);

  return (
    <div className="review-list position-relative pb-3">
      <ReviewToolBar setSearchParam={onSearchParamsChange} />
      <List className="reviews">
        {reviewList &&
          reviewList.map((review, i) => {
            return (
              <List.ListItem className="pb-4 col-lg-6" key={i}>
                <ReviewInfo data={review} />
              </List.ListItem>
            );
          })}
      </List>
      {isLoading && (
        <div className="position-relative p-3">
          <Loader />
        </div>
      )}
      {error && (
        <div className="text-center p-3">Error loading the reviews</div>
      )}
      {!error && (
        <Stack direction="horizontal" className="justify-content-center">
          <Button
            variant="light"
            className="border rounded-50 ps-5 pe-5"
            onClick={onViewAllReviews}
          >
            View All Reviews
          </Button>
        </Stack>
      )}
    </div>
  );
}
