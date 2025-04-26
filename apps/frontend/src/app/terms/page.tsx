import type { Metadata } from 'next';
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: '服务条款 | 个人博客',
  description: '使用我们网站和服务的条款和条件',
};

export default function TermsPage() {
  return (
    <Container maxWidth="2xl" paddingX={true} className="py-8">
      <Text variant="h1" className="mb-4">服务条款</Text>
      <Text variant="body2" color="secondary" className="mb-8">最后更新日期: 2024年4月20日</Text>
      
      <div className="prose prose-sm sm:prose md:prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <Text variant="h2" className="mb-4">接受条款</Text>
          <Text variant="body1">
            欢迎访问我们的网站。本服务条款（"条款"）规定了您使用我们网站及相关服务的条件。
            通过访问或使用我们的网站，您同意受这些条款的约束。如果您不同意这些条款，请不要使用我们的网站。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">定义</Text>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>"网站"</strong>指我们运营的网站，包括所有内容、功能和服务。
            </li>
            <li>
              <strong>"用户"、"您"和"您的"</strong>指访问或使用网站的任何个人或实体。
            </li>
            <li>
              <strong>"我们"、"我们的"和"本公司"</strong>指本网站的所有者和运营方。
            </li>
            <li>
              <strong>"内容"</strong>指网站上显示的所有信息、文本、图像、视频、图形、用户界面和其他材料。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">账户注册和安全</Text>
          <Text variant="body1" className="mb-2">
            某些功能可能需要您注册账户。您同意提供准确、完整和最新的注册信息。
            您有责任维护您账户的保密性，并对通过您的账户进行的所有活动负责。
            如果您发现任何未经授权使用您账户的情况，请立即通知我们。
          </Text>
          <Text variant="body1">
            我们保留在我们认为适当的情况下拒绝服务、终止账户、删除或编辑内容的权利，恕不另行通知。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">知识产权</Text>
          <Text variant="body1" className="mb-2">
            网站及其原始内容、功能和设计受版权、商标、专利和其他知识产权法律的保护。
            除非获得明确授权，否则您不得复制、修改、分发、销售或利用任何网站内容或设计元素。
          </Text>
          <Text variant="body1">
            本网站上的任何商标、服务标记和标识均为其各自所有者的财产。未经适当许可，不得使用这些商标。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">用户内容</Text>
          <Text variant="body1" className="mb-2">
            当您向网站提交、上传、发布或提供任何评论、帖子或其他内容时（"用户内容"），您授予我们非独占、免版税、
            可转让、可再许可的全球性许可，允许使用、复制、修改、改编、发布、翻译和分发该用户内容。
          </Text>
          <Text variant="body1" className="mb-2">
            您声明并保证您的用户内容不侵犯任何第三方的权利，并且不包含违法、侮辱、威胁、
            骚扰、诽谤、色情或其他令人反感的材料。
          </Text>
          <Text variant="body1">
            我们保留但无义务审查、监控或删除用户内容的权利，恕不另行通知，理由包括但不限于违反这些条款。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">禁止行为</Text>
          <Text variant="body1">使用我们的网站时，您同意不会：</Text>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>违反任何适用法律或法规</li>
            <li>侵犯他人的知识产权或其他权利</li>
            <li>传播虚假、误导或欺诈性信息</li>
            <li>上传包含病毒、木马或其他有害代码的材料</li>
            <li>干扰或破坏网站服务器或网络</li>
            <li>进行"网络爬虫"或"网络抓取"操作</li>
            <li>收集或跟踪他人的个人信息</li>
            <li>试图未经授权访问网站的任何部分</li>
            <li>骚扰、侮辱或伤害任何其他用户</li>
          </ul>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">第三方链接</Text>
          <Text variant="body1">
            我们的网站可能包含链接到第三方网站或服务。这些链接仅为方便用户提供，我们对这些网站的内容或隐私政策不承担任何责任。
            访问任何外部链接的风险由您自行承担。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">免责声明</Text>
          <Text variant="body1" className="mb-2">
            网站及其内容按"原样"和"可用"基础提供，不提供任何明示或暗示的保证或条件。
            我们不保证网站将无错误、安全或不间断运行。
          </Text>
          <Text variant="body1">
            我们不对任何因使用或无法使用网站或其内容而导致的任何损害负责，包括但不限于直接、间接、
            附带、惩罚性、特殊或后果性损害。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">责任限制</Text>
          <Text variant="body1">
            在适用法律允许的最大范围内，我们及我们的董事、员工、代理人或关联方对因您访问或使用（或无法访问或使用）
            网站而产生的任何索赔、损失、损害、诉讼、费用、开支或责任不承担责任。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">赔偿</Text>
          <Text variant="body1">
            您同意赔偿并使我们及我们的董事、员工、代理人和关联方免受任何由于您违反这些条款、
            您的用户内容或您使用网站而产生的或与之相关的索赔、责任、损害、损失和费用。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">适用法律和争议解决</Text>
          <Text variant="body1">
            这些条款受中华人民共和国法律管辖，不考虑法律冲突原则。
            与这些条款有关的任何争议应首先通过友好协商解决。
            如果无法通过协商解决，则应提交至网站所在地有管辖权的法院。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">条款修改</Text>
          <Text variant="body1">
            我们保留随时修改这些条款的权利。修改后的条款将在网站上发布时生效。
            您继续使用网站即表示您接受修改后的条款。请定期查看这些条款以了解任何更改。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">终止</Text>
          <Text variant="body1">
            我们可能会因任何原因终止或暂停您访问我们的服务，包括但不限于违反这些条款，恕不另行通知。
            终止后，您使用网站的权利将立即停止。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">可分割性</Text>
          <Text variant="body1">
            如果这些条款的任何条款被认定为无效或不可执行，其余条款将继续有效，无效或不可执行的条款
            将被视为已被修改，使其在法律允许的范围内有效和可执行。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">完整协议</Text>
          <Text variant="body1">
            这些条款构成您与我们之间关于使用网站的完整协议，并取代所有先前或同时的
            书面或口头理解和协议。
          </Text>
        </section>

        <section className="mb-8">
          <Text variant="h2" className="mb-4">联系我们</Text>
          <Text variant="body1" className="mb-2">
            如果您对这些服务条款有任何疑问，请联系我们：
          </Text>
          <div className="mt-2">
            <Text variant="body1"><strong>电子邮件：</strong> terms@example.com</Text>
            <Text variant="body1"><strong>地址：</strong> 某某省某某市某某区某某街道123号</Text>
            <Text variant="body1"><strong>电话：</strong> 123-456-7890</Text>
          </div>
        </section>
      </div>
    </Container>
  );
} 