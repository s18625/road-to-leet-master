import axios from 'axios';

export interface LeetCodeProblem {
  frontendQuestionId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  isPaidOnly: boolean;
  acRate: number;
  topicTags: { name: string; slug: string }[];
  likes?: number;
  dislikes?: number;
}

export async function fetchLeetCodeProblems(limit: number = 100, skip: number = 0): Promise<LeetCodeProblem[]> {
  const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          acRate
          difficulty
          frontendQuestionId: questionFrontendId
          isPaidOnly
          title
          titleSlug
          likes
          dislikes
          topicTags {
            name
            slug
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: {
        categorySlug: "",
        skip,
        limit,
        filters: {}
      }
    });

    return response.data.data.problemsetQuestionList.questions;
  } catch (error) {
    console.error('Error fetching LeetCode problems:', error);
    return [];
  }
}

export async function fetchProblemDetails(titleSlug: string) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        likes
        dislikes
        stats
      }
    }
  `;

  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { titleSlug }
    });
    return response.data.data.question;
  } catch (error) {
    console.error(`Error fetching details for ${titleSlug}:`, error);
    return null;
  }
}
