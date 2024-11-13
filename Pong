import pygame, sys, random

def ball_ruch():
    global ball_speed_x, ball_speed_y, score_player, score_opponent
    ball.x += ball_speed_x
    ball.y +=  ball_speed_y

    if ball.top <= 0 or ball.bottom >= height:
        ball_speed_y *= -1
    if ball.left <= 0 or ball.right >= width:
        ball_speed_x *= -1      

    if ball.left <= 0:
        score_player += 1
        ball_reset()

    if ball.right >= width:
        score_opponent += 1
        ball_reset()


    if ball.colliderect(player) or ball.colliderect(opponent):
        ball_speed_x *= -1
def player_ruch():  
    player.y += player_speed
    if player.top <= 0:
        player.top = 0
    if player.bottom >= height:
        player.bottom = height
  
def opponent_ai():
    if opponent.top < ball.y:
        opponent.top += opponent_speed
    if opponent.top > ball.y:
        opponent.bottom -= opponent_speed
def ball_reset():
    global ball_speed_x, ball_speed_y
    ball.center = (width/2, height/2)
    ball_speed_y *= random.choice((1,-1))
    ball_speed_x *= random.choice((1,-1))
def wynik():
    score_text = FONT.render(f"{score_opponent} - {score_player}", True, czarny)
    screen.blit(score_text, (width // 2 - score_text.get_width() // 2, 36))


pygame.init() 
clock = pygame.time.Clock()

width, height = 1280, 850
zielony = (123, 193, 51)
beige = (225, 198, 153)
niebieski = (135, 164, 255)
bialy = (255,255,255)
czarny = (0,0,0)
FONT = pygame.font.SysFont("Arial", 30)

ball_speed_x = 8 * random.choice((1,-1))
ball_speed_y = 8 * random.choice((1,-1))
player_speed = 0
opponent_speed = 6

score_opponent = 0
score_player = 0

screen = pygame.display.set_mode((width,height))
pygame.display.set_caption('PingPong')

ball = pygame.Rect(width/2 - 15,height/2 - 15,30,30)
player = pygame.Rect(width - 20, height/2 - 70,10,140)
opponent = pygame.Rect(10, height/2 - 70, 10,140)

tlo = pygame.Color(niebieski)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = false
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_DOWN:
                player_speed += 7
            if event.key == pygame.K_UP:
                player_speed -=7
        if event.type == pygame.KEYUP:
            if event.key == pygame.K_DOWN:
                player_speed -= 7
            if event.key == pygame.K_UP:
                player_speed +=7
    ball_ruch()
    player_ruch()
    opponent_ai()

    screen.fill(tlo)
    pygame.draw.rect(screen, beige, player)
    pygame.draw.rect(screen, beige, opponent)
    pygame.draw.ellipse(screen, zielony, ball)
    pygame.draw.aaline(screen, bialy, (width/2,0), (width/2,height))
    
    wynik()


    pygame.display.flip()
    clock.tick(60)
