import { prisma } from '../src/utils/db.js'
import { faker } from '@faker-js/faker'


async function main() {
    // Create 30 users
    const users = await Promise.all(
      Array.from({ length: 30 }).map(async () => {
        const username = faker.internet.userName();
        return prisma.user.create({
          data: {
            username,
            email: faker.internet.email(),
            password: faker.internet.password(),
            name: faker.person.fullName(),
            profilePicture: faker.image.avatar(),
            bio: faker.lorem.sentence(),
            isVerified: faker.datatype.boolean(),
            lastLogin: faker.date.past(),
          },
        });
      })
    );
  
    // Create posts, replies, and likes
    for (const user of users) {
      // Create 1-5 posts for each user
      const postCount = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < postCount; i++) {
        const post = await prisma.post.create({
          data: {
            content: faker.lorem.paragraph(),
            imageUrl: faker.datatype.boolean() ? faker.image.url() : null,
            userId: user.id,
          },
        });
  
        // Create 0-3 replies for each post
        const replyCount = faker.number.int({ min: 0, max: 3 });
        for (let j = 0; j < replyCount; j++) {
          await prisma.reply.create({
            data: {
              content: faker.lorem.sentence(),
              image: faker.datatype.boolean() ? faker.image.url() : null,
              userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
              postId: post.id,
            },
          });
        }
  
        // Create 0-10 likes for each post
        const likeCount = faker.number.int({ min: 0, max: 10 });
        const likedUserIds = new Set();
        for (let k = 0; k < likeCount; k++) {
          let randomUserId;
          do {
            randomUserId = users[faker.number.int({ min: 0, max: users.length - 1 })].id;
          } while (likedUserIds.has(randomUserId));
  
          likedUserIds.add(randomUserId);
  
          await prisma.like.create({
            data: {
              userId: randomUserId,
              postId: post.id,
            },
          });
        }
      }
  
      // Update user's followers and following
      const followersCount = faker.number.int({ min: 0, max: 10 });
      const followingCount = faker.number.int({ min: 0, max: 10 });
  
      const followers = faker.helpers.arrayElements(users.map(u => u.id).filter(id => id !== user.id), followersCount);
      const following = faker.helpers.arrayElements(users.map(u => u.id).filter(id => id !== user.id), followingCount);
  
      await prisma.user.update({
        where: { id: user.id },
        data: {
          followers: followers,
          following: following,
        },
      });
    }
  
    console.log('Seeding completed!');
  }
  
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });