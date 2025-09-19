```python
from manim import *

class Animate(Scene):
    def construct(self):
        # Draw the ground
        ground = Line([-6, -2, 0], [6, -2, 0], color="#654321", stroke_width=8)
        self.add(ground)

        # Function to create a white stick-figure person
        def get_person(shift_x, leg_sign=1, arm_sign=1):
            head = Circle(radius=0.4, fill_color="#ffffff", fill_opacity=1, color="#aaaaaa", stroke_width=3).move_to([shift_x, -0.7, 0])
            body = Line([shift_x, -1.1, 0], [shift_x, -1.8, 0], color="#ffffff", stroke_width=8)
            left_leg = Line([shift_x, -1.8, 0], [shift_x - leg_sign * 0.35, -2, 0], color="#ffffff", stroke_width=8)
            right_leg = Line([shift_x, -1.8, 0], [shift_x + leg_sign * 0.3, -2, 0], color="#ffffff", stroke_width=8)
            left_arm = Line([shift_x, -1.3, 0], [shift_x - arm_sign * 0.4, -1.4, 0], color="#ffffff", stroke_width=8)
            right_arm = Line([shift_x, -1.3, 0], [shift_x + arm_sign * 0.4, -1.2, 0], color="#ffffff", stroke_width=8)
            return VGroup(head, body, left_leg, right_leg, left_arm, right_arm)

        # Create initial person
        person = get_person(-5, 1, -1)
        self.add(person)

        # Prepare running frames
        run_poses = []
        num_frames = 24
        for i in range(num_frames):
            sign = 1 if i % 2 == 0 else -1
            run_poses.append(get_person(-5 + i * 0.45, leg_sign=sign, arm_sign=-sign))

        # Animate running
        for i in range(num_frames):
            self.play(Transform(person, run_poses[i]), run_time=0.07, rate_func=linear)

        self.wait(0.5)
```