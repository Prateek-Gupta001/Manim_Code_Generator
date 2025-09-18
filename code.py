from manim import *

class Animate(Scene):
    def construct(self):
        # Monkey body
        body = Ellipse(width=1.2, height=1.8, color="#8D5524", fill_opacity=1)
        head = Circle(radius=0.6, color="#C68642", fill_opacity=1).shift(UP*1.3)
        left_ear = Circle(radius=0.22, color="#C68642", fill_opacity=1).shift(UP*1.6 + LEFT*0.65)
        right_ear = Circle(radius=0.22, color="#C68642", fill_opacity=1).shift(UP*1.6 + RIGHT*0.65)

        # Eyes and mouth
        left_eye = Circle(radius=0.06, color=BLACK, fill_opacity=1).shift(UP*1.38 + LEFT*0.23)
        right_eye = Circle(radius=0.06, color=BLACK, fill_opacity=1).shift(UP*1.38 + RIGHT*0.23)
        mouth = Arc(radius=0.12, angle=PI, start_angle=0, color=BLACK).shift(UP*1.12)

        # Arms
        left_arm = ArcBetweenPoints(start=ORIGIN + LEFT*0.7 + UP*0.8, end=LEFT*1.2 + DOWN*0.2, angle=PI/2, color="#C68642", stroke_width=14)
        right_arm = ArcBetweenPoints(start=ORIGIN + RIGHT*0.7 + UP*0.8, end=RIGHT*1.2 + DOWN*0.2, angle=-PI/2, color="#C68642", stroke_width=14)

        # Hands
        left_hand = Circle(radius=0.11, color="#C68642", fill_opacity=1).move_to(LEFT*1.2 + DOWN*0.2)
        right_hand = Circle(radius=0.11, color="#C68642", fill_opacity=1).move_to(RIGHT*1.2 + DOWN*0.2)

        # Banana
        banana = Arc(radius=0.23, angle=-PI, color="#FFD966", stroke_width=13).shift(RIGHT*1.3 + DOWN*0.25)
        banana_tip = Dot(RIGHT*1.53 + DOWN*0.25, radius=0.06, color="#AA8D22")

        # Eating animation: Banana moves from right hand to monkey's mouth
        banana_group = VGroup(banana, banana_tip)
        
        # Legs and tail
        left_leg = Line(ORIGIN + LEFT*0.4 + DOWN*0.9, LEFT*0.45 + DOWN*1.6, color="#8D5524", stroke_width=16)
        right_leg = Line(ORIGIN + RIGHT*0.4 + DOWN*0.9, RIGHT*0.45 + DOWN*1.6, color="#8D5524", stroke_width=16)
        tail = ArcBetweenPoints(start=ORIGIN + LEFT*0.55 + DOWN*1.4, end=LEFT*1.2 + DOWN*1.8, angle=-PI, color="#8D5524", stroke_width=10)

        # Grouping monkey parts
        monkey = VGroup(body, head, left_ear, right_ear, left_eye, right_eye, mouth, left_arm, right_arm, left_hand, right_hand, left_leg, right_leg, tail)
        self.play(FadeIn(monkey))
        self.play(FadeIn(banana_group))

        # Banana moves to mouth
        self.play(banana_group.animate.move_to(UP*1.09 + RIGHT*0.3), run_time=1.2)
        # Banana fades as if eaten
        self.play(FadeOut(banana_group))
        # Monkey smiles after eating
        happy_mouth = Arc(radius=0.14, angle=PI, start_angle=0, color="#FF9900").shift(UP*1.12)
        self.play(Transform(mouth, happy_mouth))

        self.wait(1)