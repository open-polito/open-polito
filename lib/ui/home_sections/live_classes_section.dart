import 'package:flutter/material.dart';
import 'package:open_polito/api/models/courses.dart';
import 'package:open_polito/styles/styles.dart';
import 'package:open_polito/ui/home_sections/home_section_base.dart';

class LiveClassWidget extends StatelessWidget {
  final String courseName, classTitle, elapsedSinceStart, meetingUrl;

  const LiveClassWidget({
    super.key,
    required this.courseName,
    required this.classTitle,
    required this.elapsedSinceStart,
    required this.meetingUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: defaultHorizontalPadding),
      child: SizedBox(
        width: 200,
        child: DecoratedBox(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            color: Colors.red.shade400,
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        courseName,
                        style: textStyle.copyWith(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w300,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.arrow_outward_rounded,
                      size: 30,
                      color: Colors.white,
                    ),
                  ],
                ),
                Text(
                  classTitle,
                  style: textStyle.copyWith(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w300,
                  ),
                ),
                const SizedBox(
                  height: 4,
                ),
                Row(
                  children: [
                    SizedBox(
                      width: 16,
                      height: 16,
                      child: DecoratedBox(
                          decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                      )),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      elapsedSinceStart,
                      style: textStyle.copyWith(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class LiveClassesSection extends StatelessWidget {
  final String title;
  final List<VirtualClassroomLive> classes;

  const LiveClassesSection({
    super.key,
    required this.title,
    required this.classes,
  });

  @override
  Widget build(BuildContext context) {
    return HomeSectionBase(
      title: title,
      icon: Icons.live_tv_rounded,
      child: SingleChildScrollView(
        physics: BouncingScrollPhysics(),
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            const SizedBox(
              width: defaultHorizontalPadding,
            ),
            ...classes
                .map((e) => LiveClassWidget(
                    courseName: e.title,
                    classTitle: e.title,
                    elapsedSinceStart: e.createdAt,
                    meetingUrl: e.meetingId))
                .toList(),
          ],
        ),
      ),
    );
  }
}
