import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Input, Box, Link, Flex, useColorMode, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const top5StoryIds = topStoryIds.slice(0, 5);
        const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
        setFilteredStories(stories.map(story => story.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <Container centerContent maxW="container.md" py={8}>
      <Flex justifyContent="space-between" width="100%" mb={4}>
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <IconButton
          aria-label="Toggle dark mode"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
        />
      </Flex>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <VStack spacing={4} width="100%">
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
            <Text mt={2}>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;