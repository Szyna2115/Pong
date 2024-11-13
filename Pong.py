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
def Gra():
    global player_speed, score_player, score_opponent

    ball.center = (width/2, height/2)
    player_speed = 0
    score_player = 0
    score_opponent = 0

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE: 
                    menu()
                if event.key == pygame.K_DOWN:
                    player_speed += 7
                if event.key == pygame.K_UP:
                    player_speed -= 7
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_DOWN:
                    player_speed -= 7
                if event.key == pygame.K_UP:
                    player_speed += 7

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
def menu():
    menu_running = True
    menu_selected = 0 

    while menu_running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_DOWN:
                    menu_selected = (menu_selected + 1) % 3
                if event.key == pygame.K_UP:  
                    menu_selected = (menu_selected - 1) % 3
                if event.key == pygame.K_RETURN:
                    if menu_selected == 0:
                        Gra()
                    elif menu_selected == 1:
                        pass  
                    elif menu_selected == 2: 
                        pygame.quit()
                        sys.exit()
        
        screen.fill(niebieski)
        title_text = FONT.render("PING PONG", True, bialy)
        screen.blit(title_text, (width // 2 - title_text.get_width() // 2, 100))

        
        start_text = FONT.render("START", True, bialy if menu_selected != 0 else zielony)
        options_text = FONT.render("OPTIONS", True, bialy if menu_selected != 1 else zielony)
        exit_text = FONT.render("EXIT", True, bialy if menu_selected != 2 else zielony)

        screen.blit(start_text, (width // 2 - start_text.get_width() // 2, 200))
        screen.blit(options_text, (width // 2 - options_text.get_width() // 2, 300))
        screen.blit(exit_text, (width // 2 - exit_text.get_width() // 2, 400))

        pygame.display.flip()
        clock.tick(60)
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


Gra()
