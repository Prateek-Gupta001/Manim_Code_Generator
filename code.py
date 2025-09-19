```python
from manim import *

class Animate(Scene):
    def construct(self):
        # Draw the monke's head
        head = Circle(radius=1, color="#5C4037", fill_opacity=1).shift(UP*1.5)
        face = Circle(radius=0.8, color="#A0522D", fill_opacity=1).shift(UP*1.6)

        # Draw the monke's ears
        left_ear = Circle(radius=0.3, color="#5C4037", fill_opacity=1).shift(LEFT*1.2 + UP*2)
        right_ear = Circle(radius=0.3, color="#5C4037", fill_opacity=1).shift(RIGHT*1.2 + UP*2)

        # Add inside of ears
        left_ear_in = Circle(radius=0.17, color="#A0522D", fill_opacity=1).shift(LEFT*1.2 + UP*2)
        right_ear_in = Circle(radius=0.17, color="#A0522D", fill_opacity=1).shift(RIGHT*1.2 + UP*2)

        # Draw the eyes
        left_eye = Circle(radius=0.09, color=BLACK, fill_opacity=1).shift(LEFT*0.35 + UP*1.8)
        right_eye = Circle(radius=0.09, color=BLACK, fill_opacity=1).shift(RIGHT*0.35 + UP*1.8)
        
        # Draw the smiling mouth
        smile = Arc(radius=0.23, start_angle=PI, angle=PI/1.2, color=BLACK).shift(UP*1.3)

        # Draw the body
        body = Ellipse(width=1.6, height=2.2, color="#5C4037", fill_opacity=1).shift(DOWN*0.4)

        # Draw arms
        left_arm = ArcBetweenPoints(ORIGIN+LEFT*1.0+UP*0.8, LEFT*1.2+DOWN*0.5, angle=PI/2, color="#5C4037")
        right_arm = ArcBetweenPoints(ORIGIN+RIGHT*1.0+UP*0.8, RIGHT*1.4+UP*0.2, angle=-PI/3, color="#5C4037")

        # Draw hand holding fruit
        hand = Circle(radius=0.18, color="#5C4037", fill_opacity=1).move_to(LEFT*1.18 + DOWN*0.7)
        fruit = Circle(radius=0.16, color="#FF6347", fill_opacity=1).move_to(LEFT*1.18 + DOWN*0.88)
        fruit_highlight = Dot(point=LEFT*1.08 + DOWN*0.82, color=WHITE).scale(0.4)

        # Bite mark to show eating
        bite = Arc(radius=0.08, start_angle=-PI/2, angle=PI, color="#A0522D", stroke_width=8
                  ).move_to(LEFT*1.06 + DOWN*0.84)

        # Animate monke smiling and eating fruit
        monke = VGroup(
            body, head, face, left_ear, right_ear, left_ear_in, right_ear_in, 
            left_eye, right_eye, smile, left_arm, right_arm, hand, fruit, fruit_highlight
        )

        # Initial neutral mouth (not smiling)
        mouth_neutral = Arc(radius=0.23, start_angle=0, angle=PI, color=BLACK).shift(UP*1.3)
        self.play(Create(VGroup(body, head, face, left_ear, right_ear, left_ear_in, right_ear_in)))
        self.play(FadeIn(VGroup(left_eye, right_eye, left_arm, right_arm, hand, fruit, fruit_highlight)))
        self.play(Create(mouth_neutral))
        self.wait(0.5)

        # Animate "eating" (bite appears, mouth turns to smile)
        self.play(
            FadeOut(mouth_neutral), 
            Create(smile),
            Create(bite),
            run_time=1.2
        )
        self.wait(1.2)
```